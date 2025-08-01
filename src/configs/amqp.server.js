import "dotenv/config";
import amqp from "amqplib";
import { handlers } from "../utils/queue-handler.js";

const {
  RABBITMQ_ENABLE,
  RABBITMQ_PROTOCOL,
  RABBITMQ_HOST,
  RABBITMQ_USER,
  RABBITMQ_PASSWORD,
  RABBITMQ_VHOST,
} = process.env;

const connectToAmqp = async () => {
  const enableRabbitMQ = RABBITMQ_ENABLE?.toLowerCase() === "true";

  if (!enableRabbitMQ) {
    console.log("✅ Conexão com o RabbitMQ desabilitada.");
    return;
  }

  try {
    const amqpUrl = `${RABBITMQ_PROTOCOL}://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}${RABBITMQ_VHOST}`;
    const connection = await amqp.connect(amqpUrl);

    const channel = await connection.createChannel();

    const exchange = "events";
    await channel.assertExchange(exchange, "fanout", { durable: false });

    const { queue } = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(queue, exchange, "");

    channel.prefetch(1);
    console.log("[Consumer] Aguardando mensagens da exchange...");
    channel.consume(queue, async (msg) => {
      try {
        const { type, payload } = JSON.parse(msg.content.toString());
        await handlers(type, payload);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Erro ao processar mensagem:", err);
        channel.nack(msg);
      }
    });

    console.log("✅ Conexão com o RabbitMQ estabelecida com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao conectar no RabbitMQ:", error);
  }
};

export default connectToAmqp;