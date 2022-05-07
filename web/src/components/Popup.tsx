import ReactMarkdown from 'react-markdown';

export default function PopUp(props: {
  date: string;
  name: string;
  message: string;
  readme: string;
}) {
  return (
    <div className="PopUp">
      <h1>Most Recent Commit</h1>
      <p className="popup-text">
        Date: {new Date(props.date).toLocaleDateString()}
      </p>
      <p className="popup-text">Author: {props.name}</p>
      <p className="popup-text">Message: {props.message}</p>
      <p className="popup-text">ReadME:</p>
      <ReactMarkdown>{props.readme}</ReactMarkdown>
    </div>
  );
}
