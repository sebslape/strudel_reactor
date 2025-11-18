import { useState, useEffect } from "react";
import * as d3 from "d3";

const gainEventTarget = new EventTarget();

// Handles the d3 data and sends it to the graph
export function handleD3Data(event) {
    let detail = event.detail;

    if (detail.length > 20) {
        let chosenLine = detail[20];
        let GainRegex = /gain:(\d+(\.\d+)?)/;
        let gain = chosenLine.match(GainRegex);

        if (gain != null) {
            if (gain.length > 1) {
                let currentGain = gain[1];

                gainEventTarget.dispatchEvent(new CustomEvent('gainChange', {
                    detail: currentGain
                }));
            }
        }
    }
}

// A d3 graph which visualises the current gain of the track
export function Graph() {
    const [currentGain, setCurrentGain] = useState(0);
    const [gainArray, setGainArray] = useState([]);
    const maxItems = 100;
    const maxValue = 2;

    useEffect(() => {
        const handleGainChange = (event) => {
            setCurrentGain(event.detail); 
        };

        gainEventTarget.addEventListener('gainChange', handleGainChange);
    }, []);

    useEffect(() => {
        console.log(currentGain);
        let tempArray = [...gainArray, currentGain];
        if (tempArray.length > maxItems) {
            tempArray.shift();
        }
        setGainArray(tempArray);
    }, [currentGain]);

    useEffect(() => {
        const svg = d3.select('#d3graph');
        svg.selectAll("*").remove();

        let w = svg.node().getBoundingClientRect().width;
        w = w - 40;
        let h = svg.node().getBoundingClientRect().height;
        h = h - 40;

        const barWidth = w / maxItems;

        let yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([h, 0]);

        const chartGroup = svg.append('g')
            .classed('chartGroup', true)
            .attr('transform', 'translate(18,10)');
        
        chartGroup.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", yScale(0))
            .attr("x2", 0)
            .attr("y2", yScale(maxValue))
            .selectAll("stop")
                .data([
                    { offset: "0%", color: "green" },
                    { offset: "70%", color: "yellow" },
                    { offset: "100%", color: "red" }
                ])
            .enter().append("stop")
                .attr("offset", function (d) { return d.offset; })
                .attr("stop-color", function (d) { return d.color; });

        chartGroup
            .append('path')
            .datum(gainArray)
            .attr('fill', 'none')
            .attr('stroke', "url(#line-gradient)" )
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x((d, i) => i * barWidth)
                .y((d) => yScale(d))
            )
    }, [gainArray]);

    return (
        <div className="App container">
            <div className="row">
                <svg width="100%" height="200px" class="border border-primary rounded p-2" id="d3graph"></svg>
            </div>
        </div>
    )
}