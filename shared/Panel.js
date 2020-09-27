import React from 'react';

export default function Panel({content, closePanel}) {
  const classes = ['panel', 'panel-left'];
  if (!content) {
    classes.push('hidden')
  }

  return (
    <div className={classes.join(' ')}>
      <div className="u-pull-right" onClick={closePanel}>X</div>
      {content}
    </div>
  )
}
