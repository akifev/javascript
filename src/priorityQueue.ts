import { Queue } from './queue';

enum Priority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}

export class PriorityQueue<T> {
    private LQ: Queue<T>;
    private MQ: Queue<T>;
    private HQ: Queue<T>;
    private _size: number;

    constructor() {
        this.LQ = new Queue<T>();
        this.MQ = new Queue<T>();
        this.HQ = new Queue<T>();
        this._size = 0;
    }

    enqueue(value: T, priority: Priority): void {
        switch (priority) {
            case Priority.LOW:
                this.LQ.enqueue(value);
                break;
            case Priority.MEDIUM:
                this.MQ.enqueue(value);
                break;
            case Priority.HIGH:
                this.HQ.enqueue(value);
        }

        this._size += 1;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        this._size -= 1;

        if (!this.HQ.isEmpty()) {
            return this.HQ.dequeue();
        } else if (!this.MQ.isEmpty()) {
            return this.MQ.dequeue();
        } else if (!this.LQ.isEmpty()) {
            return this.LQ.dequeue();
        }
    }

    get size(): number {
        return this._size;
    }

    private isEmpty(): boolean {
        return this.size === 0;
    }
}
