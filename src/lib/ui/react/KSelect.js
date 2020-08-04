import React, { Component } from 'react';
import {KFormElement} from './index.js'
import query from '@/lib/utils/domquery.js'
export default class KSelect extends KFormElement {
	componentDidMount(){
		super.componentDidMount();
		this.layer = this.refs.layer;
		console.log('layer',this.layer)
		let layerWidth = this.layer.offsetWidth;
		console.log("query",query)
		let winWidth = query(window).width();
		console.log("width", winWidth, layerWidth)
		document.body.appendChild( this.layer )
	}
  render() {
    return (
      <div className={ this.getClassName() } ref={ this.ref }>
      	<div className="select-label">
      	</div>
      	<div className="select-poplayer" ref="layer">
		      {
		        React.Children.map( this.props.children, child =>{
		          return child;
		        })
		      }
		    </div>
      </div>
    )
  }
}