import asyncio
import json
import os
import base64
from google import genai
from google.genai import types
import websockets.legacy.server
from websockets.legacy.server import WebSocketServerProtocol

# Configura tu API KEY de Gemini
os.environ['GOOGLE_API_KEY'] = 'AIzaSyATMp4aqvo_PfYeBQvHOkFKXa1XZp_98U8'
MODEL = "models/gemini-2.5-flash-preview-native-audio-dialog" 

client = genai.Client(
    api_key=os.environ["GOOGLE_API_KEY"]
)

async def gemini_session_handler(websocket: WebSocketServerProtocol):
    print("🎙️ Conexión de usuario entrante...")

    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Aoede")
            ),
            language_code='en-US',
        ),
        system_instruction="You are a helpful assistant that speaks Spanish. Always answer using natural Spanish, even if the user asks in English."
    )

    async with client.aio.live.connect(model=MODEL, config=config) as session:

        async def send_to_gemini():
            async for message in websocket:
                try:
                    data = json.loads(message)

                    if "text" in data:
                        await session.send_client_content({
                            "parts": [
                                {
                                    "text": data["text"]
                                    }
                                ]
                            })
                except Exception as e:
                    print("❌ Error al enviar a Gemini:", e)

        async def receive_from_gemini():
            async for response in session.receive():
                try:
                    if response.server_content and response.server_content.model_turn:
                        for part in response.server_content.model_turn.parts:
                            if hasattr(part, 'inline_data') and part.inline_data:
                                audio_data = part.inline_data.data
                                base64_audio = base64.b64encode(audio_data).decode('utf-8')
                                await websocket.send(json.dumps({ "audio": base64_audio }))
                except Exception as e:
                    print("❌ Error al recibir de Gemini:", e)

        # Ejecutar envío y recepción en paralelo
        await asyncio.gather(send_to_gemini(), receive_from_gemini())

async def main():
    print("🚀 Asistente de voz activo en ws://0.0.0.0:9084")
    async with websockets.legacy.server.serve(gemini_session_handler, "0.0.0.0", 9084):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
