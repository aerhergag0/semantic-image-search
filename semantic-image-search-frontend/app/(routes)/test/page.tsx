import {Card} from "@nextui-org/card";
import {BACKEND_API_BASE_URL} from "@/constants";

export interface TestData {
    id: string;
    value: string;
    test_column: string;
}

export default async function TestPage() {

    const data = await fetch(
        `${BACKEND_API_BASE_URL}/test`,
        {cache: 'force-cache'}
    ).then(
        res => res.json()
    );

    console.log(data);

    return (
        <div>
            <h1>Test Page</h1>

            {data.map((item: TestData) => (
                <Card key={item.id}>
                    <p>{item.id}</p>
                    <p>{item.value}</p>
                    <p>{item.test_column}</p>
                </Card>
            ))}
        </div>
    );
}