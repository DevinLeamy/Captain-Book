class SDate extends Date {
    toJSON(): string {
        return this.toISOString().substring(0, 10)
    }

    static fromJSON(value: string): SDate {
        return new SDate(value)
    }
}

export { SDate }
