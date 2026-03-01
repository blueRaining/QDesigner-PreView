export class Preview {
    viewer: { resize(): void }
    constructor(options: { canvas: HTMLCanvasElement; optimization?: boolean })
    init(): Promise<void>
    loadModel(url: string): Promise<void>
    setEnvirment(url: string): Promise<void>
    dispose(): void
    showGroundGride(value:boolean):void
}

export class EventDispatcher {
    constructor()
}
