export class AppError extends Error {
  constructor(public code: number, public title: string, public description: string) {
    super();
  }
}
