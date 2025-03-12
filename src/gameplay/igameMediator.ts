export default interface IGameMediator {
    notify(sender: string, event: string, data?: any): void;
}