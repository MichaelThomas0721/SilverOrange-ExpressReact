export default interface CommitType {
  author: {
    name: string;
    date: string;
  };
  message: string;
  readme: string;
}
