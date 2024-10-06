export function wait(duration: number) {
  return new Promise((done) => setTimeout(done, duration));
}
