let currentGain = 0;

export default function handleD3Data(event) {
    let detail = event.detail;

    if (detail.length > 20) {
        let chosenLine = detail[20];
        let GainRegex = /gain:(\d+(\.\d+)?)/;
        let gain = chosenLine.match(GainRegex);

        currentGain = gain;
    }
}

export default function Graph() {
    const [gainArray, setGainArray] = useState([]);
    const maxItems = 100;

    useEffect(() => {
        let tempArray = [...gainArray, currentGain];
        if (tempArray.length > maxItems) {
            tempArray.shift();
        }
        setGainArray(tempArray);
    }, [currentGain]);
}