interface Serializable {
  status: number;
  serialize(): { message: string; field?: string }[];
}

export abstract class CustomError extends Error implements Serializable {
  abstract status: number;
  abstract serialize(): { message: string; field?: string }[];
}
