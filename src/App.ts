import TelegramBot, {Message} from "node-telegram-bot-api";
import {model, Schema} from "mongoose";

export class App {
    accountSchema:Schema<IAccount> = new Schema<IAccount>({
        user_id: {type: Number, required: true},
        acc_name: { type: String, required: true },
        start: { type: Number, required: true },
        current: { type: Number, required: true },
        date: { type: Date, default: Date.now },
    });

    transactionSchema:Schema<ITransaction> = new Schema<ITransaction>({
        user_id: { type: Number, required: true },
        acc_name: { type: String, required: true },
        date: { type: Date, default: Date.now },
        transaction_id: { type: Number, default: 0 },
        value: { type: Number, required: true },
    });

    public accountModel = model<IAccount>('Account', this.accountSchema);
    public transactionModel = model<ITransaction>('Transaction', this.transactionSchema);
    public acc_name: string;

    constructor(public bot: TelegramBot)
    {
        bot.onText(/\/start/, (msgBody: Message, match:RegExpExecArray) => {
            bot.sendMessage(msgBody.chat.id, "Привет! Это бот для учета кеша, доступные команды смотрите в Меню").then();
        });

        bot.onText(/\/add/, (msgBody: Message, match:RegExpExecArray) => {
            bot.sendMessage(msgBody.chat.id, "Введи название нового счёта").then();
            bot.on("message", (m) => this.handleAccountNew(m));
        });

        bot.onText(/\/list/, (msgBody: Message, match:RegExpExecArray) => {
            this.handleAccountList(msgBody).then();
        });
    }

    async handleAccountList(msgBody: Message)
    {
        const user_id = msgBody.chat.id;
        const myAccounts: IAccount[] =
            await this.accountModel
            .find({user_id}).populate(["acc_name", "current"])
            .exec();
        let outString = "";
        if (myAccounts.length) {
            myAccounts.forEach(account => {
                outString = outString + account.acc_name+ " - " + account.current + "\n"
            });
            await this.bot.sendMessage(msgBody.chat.id, "Вот все твои пожитки:\n" + outString)
        } else {
            await this.bot.sendMessage(msgBody.chat.id, "У тебя совсем ничего нет, нищеброд))");
        }
    }

    async handleAccountNew(msgBody: Message)
    {
        const user_id = msgBody.chat.id;
        this.acc_name = msgBody.text;

        const acc = await this.accountModel.findOne({user_id, acc_name: this.acc_name});
        if (acc) {
            this.bot.sendMessage(user_id, "Дубина! Аккаунт с таким названием уже есть! Введи скорее другое").then();
        } else {
            this.bot.off("message", (m) => this.handleAccountNew(m));
            // todo повторяется пайплайн на ввод данных
            await this.bot.sendMessage(user_id, "Введи плз стартовую сумму на твоём новом счете")
            this.bot.on("message", (m) => this.handleAccountStartValue(m));
        }
    }

    async handleAccountStartValue(msgBody: Message)
    {
        const user_id = msgBody.chat.id;
        const value = parseInt(msgBody.text);

        if (!isNaN(value)) {
            const account = new this.accountModel({
                user_id,
                acc_name: this.acc_name,
                start: value,
                current:value,
                date: Date.now()
            });
            account.save().then(() => {
                this.bot.off("message", (m) => this.handleAccountStartValue(m));
                this.bot.sendMessage(user_id, `Счет "${this.acc_name}" с суммой ${value} добавлен`).then()
            }).catch((err) => this.bot.sendMessage(user_id, `Чота не то: ${err}`).then());
        } else {
            await this.bot.sendMessage(user_id, "Чота не то, попробуй заново, блять!");
        }
    }
}