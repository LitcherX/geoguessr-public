"use client";
import LayoutOne from "@lib/layouts/layoutOne";
import React from "react";
import moment from "moment";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page() {
    const [values, setValues] = React.useState([]);
    const [changes, setChanges] = React.useState([]);
    const [neededCurrentRate, setNeededCurrentRate] = React.useState(null);
    const [neededAverageRate, setNeededAverageRate] = React.useState(null);
    React.useEffect(() => {
        async function a() {
            let data = await fetch(
                "https://romonitorstats.com/api/v1/wallboard/data/",
                {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "content-type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify({ placeId: 2534724415 }),
                    method: "POST",
                }
            );
            data = await data.json();
            console.log(data);
            let b = values;
            if (data.message) {
                console.log("asd");
                return;
            } else {
                let c2 = data?.cards[1]?.value;
                c2 = c2.replace(",", "").replace(",", "");
                c2 = parseInt(c2);
                b.push(c2);
                setValues(b);

                if (b.length > 1) {
                    let a = b[b.length - 1] - b[b.length - 2];
                    let b2 = a / 10; /** Players per second */
                    let b1 = changes;
                    if (a > 0) {
                        b1.push(b2);
                        setChanges(b1);
                    } else {
                        b.pop(0);
                        setValues(b);
                    }
                    if (b2 > 0) {
                        let c =
                            2000000000 - b[b.length - 1]; /** amount needed */
                        let d =
                            c /
                            b2; /** amount of seconds needed to complete with current join rate */
                        let e =
                            new Date() / 1 +
                            d * 1000; /** When job will complete */
                        setNeededCurrentRate(parseInt(e));
                        let f =
                            c /
                            (b1.reduce((sum, num) => sum + num, 0) /
                                b1.length); /** Time needed average join rate */
                        let g = new Date() / 1 + f * 1000;
                        setNeededAverageRate(parseInt(g));
                        console.log({ e, g });
                    }
                }
            }
        }
        a();
        setInterval(() => {
            a();
        }, 10000);
    }, []);
    if (values.length > 1) {
        if (values[values.length - 1] >= 2000000000) {
            return (
                <>
                    WE HAVE REACHED 2 BILLION VISITS <br />
                    Live visit count:{" "}
                    {values.length > 1
                        ? values[values.length - 1]?.toLocaleString()
                        : "Loading data..."}
                </>
            );
        }
        return (
            <>
                Current view count:{" "}
                {values.length > 1
                    ? values[values.length - 1]?.toLocaleString()
                    : "Loading data..."}
                <br /> <br />
                Prediction using averaged join rate (
                {changes.length >= 2
                    ? (
                          changes.reduce((sum, num) => sum + num, 0) /
                          changes.length
                      ).toFixed(2)
                    : "Loading data..."}
                ):{" "}
                {values.length > 0
                    ? moment(neededAverageRate).format("YYYY-MM-DD HH:mm:ss")
                    : "Gathering data, please wait..."}
                <br></br>
                Prediction using current join rate (
                {changes.length >= 2
                    ? changes[changes.length - 1].toFixed(2)
                    : "Loading data..."}
                ):{" "}
                {values.length > 0
                    ? moment(neededCurrentRate).format("YYYY-MM-DD HH:mm:ss")
                    : "Gathering data, please wait..."}
            </>
        );
    } else {
        return <>Loading...</>;
    }
}

Page.getLayout = function getLayout(page) {
    return <LayoutOne>{page}</LayoutOne>;
};
