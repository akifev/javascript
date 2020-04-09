class Node<T> {
    public next: Node<T> | undefined = undefined;

    constructor(public value: T) {
        this.value = value;
    }
}

export class Queue<T> {
    private _head: Node<T> | undefined;
    private _tail: Node<T> | undefined;
    private _size: number;

    constructor() {
        this._head = undefined;
        this._tail = undefined;
        this._size = 0;
    }

    enqueue(value: T): void {
        const newNode = new Node(value);

        if (this.isEmpty()) {
            this._head = newNode;
            this._tail = newNode;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._tail!.next = newNode;
            this._tail = newNode;
        }

        this._size += 1;
    }

    dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const value = this._head!.value;

        if (this.size === 1) {
            this._tail = undefined;
            this._head = undefined;
        } else {
            // size > 1

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

        for (let i = 0; i < this.size - index - 1; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            currentNode = currentNode!.next;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return currentNode!.value;
    }

    get size(): number {
        return this._size;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }
}
