<template>
    <div>
      <div class="container"></div>
      <!-- <detail-panel ref="detailPanel" @update="getQueryResult"></detail-panel> -->
    </div>
  </template>
<script lang="ts" setup>
    // import detailPanel from './detailPanel.vue'
    import { ref, onMounted, onUnmounted, reactive, ssrContextKey } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { findAuthorByAuthorId,listPersonByRelation} from '@/api/common'
    const props = defineProps({
        personId:String,
    })
    import * as d3 from 'd3'

    const datas = reactive({
        svgArea: null,
        links: [] as any,
        nodes: [] as any,
        nodesName: [] as any,
        linksName: [] as any,
        simulation: null,
        scale: 1,
        width: 800,
        height: 500,
        colorList: ['#FD7623', '#3388B1', '#D82952', '#F3D737', '#409071', '#D64E52'],
        testGraph: {
            "nodes": [],
            "links": []
        }
    })
    const getGraphData=()=>{
        listPersonByRelation({"personId":props.personId,"assocCode":-1}).then(res=>{
            console.log(res);
            debugger
            datas.testGraph["nodes"] = res.data.customNodes
            // datas.testGraph["links"] = res.data.personLinks
            initGraph(datas.testGraph)
            debugger
            // datas.testGraph["nodes"] = res.data.customNodes
            datas.testGraph["links"] = res.data.personLinks
            updateGraph(datas.testGraph)
        })
    }
    getGraphData()
    const  initGraph=(data)=>{
          const links = data.links;
          const nodes = data.nodes;

          datas.simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(
                d => d.id
            ).distance(150))
            .force("collide",d3.forceCollide().radius(()=>30))
            .force("charge", d3.forceManyBody().strength(-10))
            .force("center", d3.forceCenter(datas.width / 2, datas.height / 2));

            datas.svgArea = d3.select(".container")
            .append("svg")
            .attr("viewBox", [0, 0, datas.width, datas.height])
            .call(d3.zoom().on("zoom",function () {
              g.attr("transform",d3.event.transform)
            }))

          addMarkers();

          const g = datas.svgArea.append("g")
            .attr("class","content")

            datas.links = g.append("g")
            .selectAll("path")
            .data(links,function (d) {
              if(typeof (d.source) === 'object'){
                return d.source.id+"_"+d.relationship+"_"+d.target.id
              }
              else{
                return d.source+"_"+d.relationship+"_"+d.target
              }
            })
            .join("path")
            .attr("marker-end", "url(#positiveMarker)")
            .attr("stroke-width", d => Math.sqrt(d.value))
            .attr("class","link")
            .attr("id",function (d) {
              if(typeof (d.source) === 'object'){
                return d.source.id+"_"+d.relationship+"_"+d.target.id
              }
              else{
                return d.source+"_"+d.relationship+"_"+d.target
              }
            })

          datas.linksName = g.append("g")
            .selectAll("text")
            .data(links,function (d) {
              if(typeof (d.source) === 'object'){
                return d.source.id+"_"+d.relationship+"_"+d.target.id
              }
              else{
                return d.source+"_"+d.relationship+"_"+d.target
              }
            })
            .join("text")
            .style('text-anchor','middle')
            .style('fill', 'white')
            .style('font-size', '10px')
            .style('font-weight', 'bold');

            datas.linksName
            .append('textPath')
            .attr('xlink:href',d =>"#"+d.source+"_"+d.relationship+"_"+d.target)
            .attr('startOffset','50%')
            .text(d=>d.relationship);

          datas.nodes = g.append("g")
            .selectAll("circle")
            .data(nodes,d=>d.id)
            .join("circle")
            .attr("r", 30)
            .attr("class","node")
            .attr("fill", color)
            .on("click",select)
            .call(drag(datas.simulation));

          datas.nodes.append("title")
            .text(d => d.id);

          datas.nodesName = g.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.id)
            .attr("dx",function (this:any) {
                let that = this
              return that.getBoundingClientRect().width/2*(-1)
            })
            .attr("dy",50)
            .attr("class","nodeName")

          datas.simulation.on("tick", () => {
            datas.links
              .attr("d", function(d){
                if(d.source.x<d.target.x){
                  let a = "M "+d.source.x+" "+ d.source.y +" L "+d.target.x+" "+d.target.y
                  return a
                }
                else{
                  let a = "M "+d.target.x+" "+ d.target.y +" L "+d.source.x+" "+d.source.y
                  return a
                }
              })
              .attr("marker-end",function (d) {
                if(d.source.x<d.target.x){
                  return "url(#positiveMarker)"
                }
                else{
                  return null
                }
              })
              .attr("marker-start",function (d) {
                if(d.source.x<d.target.x){
                  return null
                }
                else{
                  return "url(#negativeMarker)"
                }
              })

            datas.nodes
              .attr("cx", d => d.x)
              .attr("cy", d => d.y);

            datas.nodesName
              .attr("x",d => d.x)
              .attr("y",d => d.y);
          });

        }
    const addMarkers =()=>{
          const positiveMarker = datas.svgArea.append("marker")
            .attr("id","positiveMarker")
            .attr("orient","auto")
            .attr("stroke-width",2)
            .attr("markerUnits", "strokeWidth")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 35)
            .attr("refY", 0)
            .attr("markerWidth", 12)
            .attr("markerHeight", 12)
            .append("path")
            .attr("d", "M 0 -5 L 10 0 L 0 5")
            .attr('fill', '#999')
            .attr("stroke-opacity", 0.6);
          const negativeMarker = datas.svgArea.append("marker")
            .attr("id","negativeMarker")
            .attr("orient","auto")
            .attr("stroke-width",2)
            .attr("markerUnits", "strokeWidth")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", -25)
            .attr("refY", 0)
            .attr("markerWidth", 12)
            .attr("markerHeight", 12)
            .append("path")
            .attr("d", "M 10 -5 L 0 0 L 10 5")
            .attr('fill', '#999')
            .attr("stroke-opacity", 0.6);
        }
    const updateGraph=(data)=>{
          const links = data.links;
          const nodes = data.nodes;

          datas.links = datas.links
            .data(links,function(d){
              if(typeof (d.source) === 'object'){
                return d.source.id+"_"+d.relationship+"_"+d.target.id
              }
              else{
                return d.source+"_"+d.relationship+"_"+d.target
              }
            })
            .join('path')
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", d => Math.sqrt(d.value))
            .attr("marker-end", "url(#positiveMarker)")
            .merge(datas.links)
            .attr('id',function (d) {
              if(typeof (d.source) === 'object'){
                return d.source.id+"_"+d.relationship+"_"+d.target.id
              }
              else{
                return d.source+"_"+d.relationship+"_"+d.target
              }
            })
            .attr("class","link");

            datas.linksName = datas.linksName
            .data(links,function(d){
              if(typeof (d.source) === 'object'){
                return d.source.id+"_"+d.relationship+"_"+d.target.id
              }
              else{
                return d.source+"_"+d.relationship+"_"+d.target
              }
            })
            .join('text')
            .style('text-anchor','middle')
            .style('fill', 'white')
            .style('font-size', '10px')
            .style('font-weight', 'bold');

            datas.linksName
            .append('textPath')
            .attr(
              'xlink:href',function (d) {
                if(typeof (d.source) === 'object'){
                  return "#"+d.source.id+"_"+d.relationship+"_"+d.target.id
                }
                else{
                  return "#"+d.source+"_"+d.relationship+"_"+d.target
                }
              }
            )
            .attr('startOffset','50%')
            .merge(datas.linksName)
            .text(d=> d.relationship);

            datas.nodes = datas.nodes
            .data(nodes,d=>d.id)
            .join("circle")
            .attr("r", 30)
            .attr("class","node")
            .attr("fill", color)
            .merge(datas.nodes)
            .on("click",select)
            .call(drag(datas.simulation));

            datas.nodes.append("title")
            .text(d => d.id);

            datas.nodesName =  datas.nodesName
            .data(nodes)
            .join("text")
            .merge(datas.nodesName)
            .text(function (d) {
              return d.id
            })
            .attr("dx",function (this:any) {
                let that = this
                return that.getBoundingClientRect().width/2*(-1)
            })
            .attr("dy",50)
            .attr("class","nodeName")

            datas.simulation.nodes(nodes)
            datas.simulation.force("link").links(datas.links)
            datas.simulation.alpha(0.2).restart()
        }
    const color = (d) => {
          return datas.colorList[d.group]
        }
    const drag =(simulation)=> {
          function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }

          function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          }

          function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0.5);
            d.fx = null
            d.fy = null
          }

          return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
        }
    const select=(d)=>{
          let data = {}
          for(var i in d.obj){
            let ifArray = d.obj[i] instanceof Array
            if(!ifArray){
              data[i] = d.obj[i]
            }
          }
        //   _this.$refs.detailPanel.currentNode= data
        //   _this.$refs.detailPanel.ifShow = true
        }
    const getQueryResult=(result,currentNode,currentType)=>{
          for(var i=0;i<result.length;i++){//result:查询得到的节点组
            let flag = true
            for(var j=0;j<datas.testGraph.nodes.length;j++){
              if(datas.testGraph.nodes[j].id === result[i].id){
                flag = false
              }
            }
            if(flag){
              datas.testGraph.nodes.push(result[i])
            }
            else{
              console.log("已存在的节点")
              console.log(result[i])
            }
            datas.testGraph.links.push({
              "source":currentNode.name,
              "target":result[i].id,
              "value":5,
              "relationship":currentType
            })
          }

          for(var i=datas.testGraph.links.length-1;i>=0;i--){
            if(datas.testGraph.links[i].source.id === currentNode.name && datas.testGraph.links[i].relationship !== currentType){
              let ifRemove = true;
              for(var k=0;k<result.length;k++){
                if(result[k].id === datas.testGraph.links[i].target.id){
                  ifRemove = false
                  console.log("不移除此节点"+result[k].id)
                  break
                }
              }
              if(ifRemove){
                console.log(datas.testGraph.nodes)
                for(var j=datas.testGraph.nodes.length-1;j>=0;j--){
                  console.log("移除此节点"+datas.testGraph.links[i].target.id)
                  if(datas.testGraph.nodes[j].id === datas.testGraph.links[i].target.id){
                    datas.testGraph.nodes.splice(j, 1);
                  }
                }
                console.log(datas.testGraph.nodes)
              }
              datas.testGraph.links.splice(i,1)
            }
          }
          updateGraph(datas.testGraph)
        }
</script>