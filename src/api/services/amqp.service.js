import amqp from 'amqplib';
import "dotenv/config";

const {
  RABBITMQ_PROTOCOL,
  RABBITMQ_HOST,
  RABBITMQ_USER,
  RABBITMQ_PASSWORD,
  RABBITMQ_VHOST,
} = process.env;

class AmqpService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (this.connection && this.channel) return;

    try {
      const amqpUrl = `${RABBITMQ_PROTOCOL}://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}${RABBITMQ_VHOST}`;
      this.connection = await amqp.connect(amqpUrl);

      this.connection.on('close', async () => {
        console.warn('🔌 Conexão com RabbitMQ encerrada. Tentando reconectar...');
        this.connection = null;
        this.channel = null;
        setTimeout(() => this.connect(), 5000);
      });

      this.connection.on('error', (err) => {
        console.error('❌ Erro na conexão com RabbitMQ:', err.message);
      });

      this.channel = await this.connection.createChannel();
      console.log('✅ Conexão com RabbitMQ estabelecida');
    } catch (err) {
      console.error('❌ Falha ao conectar no RabbitMQ:', err.message);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async publishToExchange(exchange, routingKey, message) {
    await this.connect();

    await this.channel.assertExchange(exchange, 'fanout', { durable: false });
    this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    console.log(`📤 Publicado na exchange "${exchange}" com routingKey "${routingKey}":`, message);
  }

  async consumeFromExchange(exchange, onMessage) {
    await this.connect();

    await this.channel.assertExchange(exchange, 'fanout', { durable: false });

    const q = await this.channel.assertQueue('', { exclusive: true });
    await this.channel.bindQueue(q.queue, exchange, '');

    this.channel.consume(q.queue, (msg) => {
      if (msg.content) {
        const message = JSON.parse(msg.content.toString());
        console.log(`📥 Evento recebido da exchange "${exchange}":`, message);
        onMessage(message);
      }
    }, { noAck: true });
  }
}

export default AmqpService;