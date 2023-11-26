class UUID {
  private static readonly epoch = 1609459200000; // 2021-01-01T00:00:00.000Z
  private static readonly workerIdBits = 5;
  private static readonly maxWorkerId = -1 ^ (-1 << UUID.workerIdBits);
  private static readonly sequenceBits = 12;
  private static readonly workerIdShift = UUID.sequenceBits;
  private static readonly timestampLeftShift = UUID.sequenceBits + UUID.workerIdBits;
  private static readonly sequenceMask = -1 ^ (-1 << UUID.sequenceBits);

  private lastTimestamp = -1;
  private sequence = 0;
  private readonly workerId: number;

  constructor(workerId: number) {
    if (workerId < 0 || workerId > UUID.maxWorkerId) {
      throw new Error(`Worker ID must be between 0 and ${UUID.maxWorkerId}`);
    }
    this.workerId = workerId;
  }

  generateUniqueId(idType: { idType: string | number, idValues: (string | number)[] }): string | number {
    const { idType: targetType, idValues } = { ...idType };

    if (targetType === 'string') {
      return this.generateStringId();
    } else {
      return this.generateNumericId(idValues);
    }
  }

  private generateStringId(): string {
    let timestamp = this.currentTimestamp();

    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock is moving backwards. Refusing to generate id');
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & UUID.sequenceMask;
      if (this.sequence === 0) {
        // Sequence overflow, wait for next millisecond
        timestamp = this.waitNextMillis();
      }
    } else {
      // New millisecond, reset sequence
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const id = ((timestamp - UUID.epoch) << UUID.timestampLeftShift) |
               (this.workerId << UUID.workerIdShift) |
               this.sequence;

    return id.toString();
  }

  private generateNumericId(idValues: (string | number)[]): number {
    return idValues[idValues.length - 1] as number + 1;
  }

  private currentTimestamp(): number {
    return new Date().getTime();
  }

  private waitNextMillis(): number {
    let timestamp = this.currentTimestamp();
    while (timestamp <= this.lastTimestamp) {
      timestamp = this.currentTimestamp();
    }
    return timestamp;
  }
}

export default UUID