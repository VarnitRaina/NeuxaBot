import { Telegraf } from "telegraf";
import userModel from "./src/models/User.js";
import eventModel from "./src/models/Event.js"
import connectDB from './src/config/db.js'
import { message } from "telegraf/filters";
import {GoogleGenerativeAI} from "@google/generative-ai";
const bot= new Telegraf(process.env.BOT_TOKEN);


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
try{
    connectDB();
    console.log('Database connected successfully');
    
}
catch(err){
    console.log(err);
    process.kill(process.pid,'SIGTERM')
}




bot.start(async(ctx)=>{
    const from=ctx.update.message.from;
    console.log("from", from);
    try{
        await userModel.findOneAndUpdate({tgId: from.id},{
            $setOnInsert:{
                firstName:from.first_name,
                lastName:from.last_name,
                isBot:from.is_bot,
                username:from.username
            }
        },{upsert:true,new:true});
        await ctx.reply(
            `Hey! ${from.first_name}, Welcome. I will be writing highly engaging social media posts for you 🚀 Just keep feeding me with the events throughout the day. Let's shine on social media 🌟`
        )
    }
    catch(err){
        console.log(err);
        await ctx.reply("Facing difficulties!")
    }
})

bot.help((ctx) => {
    ctx.reply('For support contact @VARNITRAINA1DS22CS243');
});
bot.command('generate',async(ctx)=>{
    const from=ctx.update.message.from;
    const {message_id:waitingMessageId}=await ctx.reply(
        `Hey! ${from.first_name},kindly wait for a moment.I am curating posts for you 🚀`
    );
    const {message_id:loadingStickerMegId}=await ctx.replyWithSticker(
        'CAACAgIAAxkBAANjaKTu3J9mmWA97ERTGoUqe1LpRkcAAhsJAAIYQu4I3Lml1fNKrsg2BA'
    )
    const startOfDay=new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay=new Date();
    endOfDay.setHours(23,59,59,999);
    //getting events for the user
    const events= await eventModel.find({
        tgId: from.id,
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
        }
    });
    if(events.length===0){
        await ctx.deleteMessage(waitingMessageId);
        await ctx.deleteMessage(loadingStickerMegId);
        await ctx.reply("No events for the day");
        return;
    }

    console.log('events',events);


   try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Construct the prompt for Gemini
    const prompt = `Act as a senior copywriter, you write highly engaging posts for linkedin, facebook and twitter using provided thoughts/events throughout the day. Write like a human, for humans. Craft three engaging social media posts tailored for LinkedIn, Facebook, and Twitter audiences. Use simple language. Use given time labels just to understand the order of the event, don’t mention the time in the posts. Each post should creatively highlight the following events. Ensure the tone is conversational and impactful. Focus on engaging the respective platform’s audience, encouraging interaction, and driving interest in the events: ${events.map((events) => events.text).join(', ')}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const promptTokens=response.usageMetadata.promptTokenCount;
    const completionTokens=response.usageMetadata.candidatesTokenCount;
    console.log('completion:', text);
    await userModel.findOneAndUpdate({
        tgId:from.id,
    },{
        $inc:{
            promptTokens:promptTokens,
            completionTokens:completionTokens,
        }
    })
    await ctx.deleteMessage(waitingMessageId);
    await ctx.deleteMessage(loadingStickerMegId);
    await ctx.reply(text);

} catch (err) {
    console.error('Error with Gemini API call:', err);
    await ctx.reply("Facing difficulties. Please ensure your API key and model name are correct.");
}
    
    
})

// bot.on(message('sticker'),(ctx)=>{
//     console.log('sticker',ctx.update.message);
    
// })

bot.on(message('text'),async(ctx)=>{
    const from =ctx.update.message.from;
    const message=ctx.update.message.text;
    try{
        await eventModel.create({
            text:message,
            tgId:from.id
        });
        await ctx.reply('Noted 👍,Keep texting me your thoughts. To generate the posts, just enter the command: /generate');
    }
    catch(err){
        console.log(err);
        await ctx.reply("Facing difficulties, please try again later.")
    }
    
})


bot.launch();


process.once('SIGINT',()=> bot.stop('SIGINT'));
process.once('SIGTERM',()=> bot.stop('SIGTERM'));