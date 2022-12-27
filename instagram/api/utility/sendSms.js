import axios from "axios";

export const sendSms = async (number, message) => {
     await axios.get(`https://bulksmsbd.net/api/smsapi?api_key=qmnA0iatOgKHw3EnI1cO&number=${number}&senderid=03590002777&message=${message}`)
}




// import  Vonage from '@vonage/server-sdk'

// const vonage = new Vonage({
//   apiKey: "94bdac0a",
//   apiSecret: "tz16ujkHYDXyoC4R"
// })

// export const sendSms = () => {
//     const from = "Vonage APIs"
//     const to = "8801839895353"
//     const text = 'A text message sent using the Vonage SMS API'

//     vonage.message.sendSms(from, to, text, (err, responseData) => {
//         if (err) {
//             console.log(err);
//         } else {
//             if(responseData.messages[0]['status'] === "0") {
//                 console.log("Message sent successfully.");
//             } else {
//                 console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//             }
//         }
//     })
// }