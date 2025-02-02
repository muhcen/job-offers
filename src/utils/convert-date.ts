export function convertPostedDate(dateString: string): Date {
  if (dateString.includes('T')) {
    return new Date(dateString);
  }
  return new Date(`${dateString}T00:00:00.000Z`);
}
