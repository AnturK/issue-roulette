import useSWR from 'swr'
import { useRouter } from 'next/router'

const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json())

export default function IssueDetail(props : { id : number}) {
    const id  = props.id
    const { data, error } = useSWR(`/api/issue/${id}`, fetcher)
    if(error !== undefined)
      return (<div>Error : {error}</div>)
    return (
      <div>
        <h2>
          {data !== undefined ? <a className="font-medium text-indigo-600 hover:text-indigo-400" href={data?.html_url} target="_blank" rel="noreferrer">#{data?.number} : {data?.title}</a> : "Rolling..."}
        </h2>
      </div>
    )
}