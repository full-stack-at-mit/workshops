const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const util = require('util');
const sleep = util.promisify(setTimeout);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get environment variables
const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});
const assistantId = 'asst_AIUwg96COpnDPsX0I8ojWxwu';

app.post('/chat', async (req, res) => {
    try {
        // Get text from request
        const userMessage = req.body.text;

        if (!userMessage) {
            return res.status(400).json({ error: 'No text provided' });
        }

        // Send text to OpenAI API
        const thread = await client.beta.threads.create();
        const threadId = thread.id;

        await client.beta.threads.messages.create(threadId, {
            role: "user",
            content: userMessage,
        });

        const run = await client.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
        });

        let response = await client.beta.threads.runs.retrieve(threadId, run.id);

        while (response.status === "in_progress" || response.status === "queued") {
            await sleep(1000);
            response = await client.beta.threads.runs.retrieve(threadId, run.id);
        }

        const messageList = await client.beta.threads.messages.list(threadId);
        const assistantResponse = messageList.data
            .filter((message) => message.run_id === run.id && message.role === "assistant")
            .pop();

        // Return the response
        return res.status(200).json({ response: assistantResponse.content[0]["text"].value });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
