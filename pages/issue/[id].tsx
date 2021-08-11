import { IssueInfo } from '..'

export default function IssueDetail(props : { issue : IssueInfo}) {
    const issue = props.issue
    return (
      <div>
        <h2>
          {issue !== undefined ? <a className="font-medium text-indigo-600 hover:text-indigo-400" href={issue.url} target="_blank" rel="noreferrer">#{issue.number} : {issue.title}</a> : "Rolling..."}
        </h2>
      </div>
    )
}