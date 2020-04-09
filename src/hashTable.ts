class Node<T> {
    public key: string | object;
    public value: T;

    constructor(key: string | object, value: T) {
        this.key = key;
        this.value = value;
    }
}

// Fake HashTable
export class HashTable<T> {
    private hashTable = new Array<Node<T>>();

    public get(key: string | object): T | undefined {
        for (const node of this.hashTable) {
            if (node.key === key) {
                return node.value;
            }
        }

        return undefined;
    }

    public put(key: string | object, value: T): void {
        if (this.get(key) === undefined) {
            this.hashTable.push(new Node(key, value));
        } else {
            // fake collision
        }
    }

    public clear(): void {
        this.hashTable = new Array<Node<T>>();
    }

    get size(): number {
        return this.hashTable.length;
    }
}
