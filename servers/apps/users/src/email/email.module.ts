import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          secure: true,
          auth: {
            user: config.get('SMTP_MAIL'),
            password: config.get('SMTP_PASSWORD')
          }
        },
        defaults: {
          form: `"No Reply" <${config.get('SMTP_MAIL')}>`
        },
        template: {
          dir: join(__dirname, '../../../../email-templates/activation-mail.ejs'),
          adapter: new EjsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [EmailService]
})
export class EmailModule {}
