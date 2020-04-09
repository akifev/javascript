class Node<T> {
    public next: Node<T> | undefined = undefined;

    constructor(public value: T) {
        this.value = value;
    }
}

export class RingBuffer<T> {
    private _head: Node<T> | undefined;
    private _tail: Node<T> | undefined;
    private _size: number;

    constructor(private readonly _capacity: number) {
        this._head = undefined;
        this._tail = undefined;
        this._size = 0;
    }

    push(value: T): void {
        if (this.capacity === 0) {
            return;
        }

        if (this.size === this.capacity) {
            this.shift();
            this.push(value);

            return;
        }

        const newNode = new Node(value);

        if (this.isEmpty()) {
            this._head = newNode;
            this._tail = newNode;
        } else {
            // size < capacity

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._tail!.next = newNode;
            this._tail = newNode;
        }
        this._size += 1;
    }

    shift(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const value = this._head!.value;

        if (this.size === 1) {
            this._tail = undefined;
            this._head = undefined;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._head = this._head!.next;
        }

        this._size -= 1;

        return value;
    }

    get(index: number): T | undefined {
        if (index < 0 || index >= this.size) {
            return undefined;
        }

        let currentNode = this._head;

        for (let i = 0; i < index; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            currentNode = currentNode!.next;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return currentNode!.value;
    }

    static concat<T>(...buffers: RingBuffer<T>[]): RingBuffer<T> {
        let totalCapacity = 0;
        buffers.forEach(buffer => (totalCapacity += buffer.capacity));

        const ringBuffer = new RingBuffer<T>(totalCapacity);

        buffers.forEach(buffer => {
            for (let i = 0; i < buffer.size; i++) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ringBuffer.push(buffer.get(i)!);
            }
        });

        return ringBuffer;
    }

    get size(): number {
        return this._size;
    }

    get capacity(): number {
        return this._capacity;
    }

    private isEmpty(): boolean {
        return this.size === 0;
    }
}
