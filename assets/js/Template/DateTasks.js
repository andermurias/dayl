import React from "react";
import {withRouter, useParams} from "react-router-dom";


const DateTasks = ({date, location}) => {
  const query = useParams();
  return (<>
    {date||query.date} Daily Tasks
  </>);
}

export default withRouter(DateTasks);