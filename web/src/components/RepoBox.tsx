import React from 'react';

export default function RepoInfo(props: any) {
  return (
    <div className="RepoContainer">
      <h2 className="NameClass">{props.name}</h2>
      <h3 className="DescriptionClass">{props.description}</h3>
      <p className="LanguageClass">Language: {props.language}</p>
      <p className="ForkClass">Forks: {props.forks}</p>
      <p className="CreatedClass">
        Created At: {new Date(props.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
