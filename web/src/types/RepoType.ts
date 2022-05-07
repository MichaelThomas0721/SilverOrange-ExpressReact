export default interface RepoType {
  id: number;
  name: string;
  description: string;
  language: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  forks_count: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  full_name: string;
}
