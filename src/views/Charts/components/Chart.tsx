import React, { useEffect, useRef } from 'react'
import { UDFCompatibleDataFeed } from './chart/udf-compatible-datafeed'

declare global {
    interface Window {
        TradingView: any
    }
}
window.TradingView = window.TradingView || {}

const Chart = ({title, pair, network}) => {

    const chartViewerRef = useRef(null)
    const containerRef = useRef(null)

    let initY = 0
    let initHeight = 0

    const resizeStart = (e) => {
        document.addEventListener("touchEnd", resizeStop);
        document.addEventListener("mouseup", resizeStop);
        document.addEventListener("mousemove", onResize);
        document.addEventListener("touchmove", onResize);
        initY = e.touches ? e.touches[0].clientY : e.clientY;
        initHeight = containerRef.current.offsetHeight;
    }

    const resizeStop = () => {
        document.removeEventListener("touchmove", onResize);
        document.removeEventListener("mousemove", onResize);
        document.removeEventListener("mouseup", resizeStop);
        document.removeEventListener("touchend", onResize);
    };
    
    const onResize = (e) => {
        containerRef.current.style.height = `${initHeight + ((e.touches ? e.touches[0].clientY : e.clientY) - initY)}px`;
          // initHeight + ((e.touches ? e.touches[0].clientY : e.clientY) - initY) + "px";
    };

    useEffect(() => {
        console.log("bug= Chart Useffect here");
        const option = {
            debug: false,
            fullscreen: false,
            autosize: true,
            theme: "Dark",
            symbol: title,
            interval: "4h",
            container: chartViewerRef.current,
            datafeed: new UDFCompatibleDataFeed(pair, network),
            library_path: "charting_library/",
            enabled_features: [],
            disabled_features: [
                "header_symbol_search",
                "symbol_search_hot_key",
                "header_compare",
            ],
            timezone: "Etc/UTC",
            // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            // locale: Intl.DateTimeFormat().resolvedOptions().locale,
        };
        console.log("trading view option: ", option);
        const tvWidget = new window.TradingView.widget(option);
        return () => tvWidget?.remove();
    }, [title, pair, network]);
    console.log("bug= Chart Rendering")
    return <div
        ref={containerRef}
        className="position-relative"
        style={{ height: "100%", minHeight: 400 }}
    >
        <div ref={chartViewerRef} className="chart" />
        <div
            className="resizer fa fa-arrows-v"
            onMouseDown={resizeStart}
            onMouseOut={resizeStop} onBlur={() => {return undefined}}
            onMouseUp={resizeStop}
            onTouchStart={resizeStart}
            onTouchEnd={resizeStop}
            style={{color: 'white'}}
            role="button"
            tabIndex={0}
        >{" "}</div>
    </div>
}

export default Chart