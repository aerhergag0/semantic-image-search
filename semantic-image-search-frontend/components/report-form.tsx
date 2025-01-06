import {Textarea} from "@nextui-org/input";
import {useState} from "react";
import {Select, SelectItem} from "@nextui-org/select";
import toast from "react-hot-toast";
import {BACKEND_API_BASE_URL} from "@/constants";
import {ImageSearchData} from "@/components/image-search";
import {Button} from "@nextui-org/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {Siren} from "lucide-react";


type ReportData = {
    category: string;
    imageId: string;
    reportReason?: string;
};

interface ReportFormProps {
    onSubmit?: (data: ReportData) => Promise<any>;
    imageData: ImageSearchData
    onClose: () => void;
}

export default function ReportForm({imageData, onClose}: ReportFormProps) {

    const [reportCategory, setReportCategory] = useState<string>('');
    const [touched, setTouched] = useState(false);
    const isValid = reportCategory !== null && reportCategory.length > 0;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<ReportData>();

    const categories = [
        {key: "inappropriate_content", label: "부적절한 내용"},
        {key: "broken_or_empty_image", label: "내용이 없음, 파일이 깨짐"},
        {key: "violent_image", label: "잔인한, 폭력적인 이미지"},
        {key: "explicit_image", label: "선정적인 이미지"},
        {key: "horror", label: "공포를 유발하는 이미지"},
        {key: "advertisement_spam", label: "광고, 스팸"},
        {key: "other", label: "기타"},
    ];

    const onSubmit: SubmitHandler<ReportData> = async (data) => {

        const reportData = {
            post_id: imageData.id,
            report_category: data.category,
            report_reason: data.reportReason,
        };

        fetch(`${BACKEND_API_BASE_URL}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData),
        })
            .then(res => {
                if (res.status === 200) {
                    toast.success("신고가 접수되었습니다.");
                    reset();
                } else {
                    return res.json().then(err => {
                        toast.error(err.message);
                    });
                }
            })
            .catch(err => {
                console.error('Error submitting report:', err);
                toast.error('서버와의 통신 중 오류가 발생했습니다.');
            });
    }

    return (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex items-center gap-2 mb-4">
                <Siren className="w-5 h-5 text-red-500"/>
                <h2 className="text-lg font-semibold text-gray-800">Report Image</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <Select {...register("category", {required: "true"})}
                            items={categories}
                            className="max-w-md"
                            variant={"bordered"}
                            errorMessage={isValid || !touched ? "" : "신고 유형을 선택해야 합니다."}
                            isRequired
                            isInvalid={!(isValid || !touched)}
                            onClose={() => setTouched(true)}
                            onSelectionChange={(value) => setReportCategory(value.toString)}
                            label=" "
                            labelPlacement="outside"
                    >
                        {(category) => <SelectItem key={category.key}>{category.label}</SelectItem>}
                    </Select>
                </div>

                <div>
                    <Textarea {...register("reportReason", {})}
                              variant={"bordered"}
                              placeholder="Enter the reason for reporting this image"
                              className="w-full"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                    <Button color="danger"
                            type="submit"
                            disabled={!isValid}
                            isLoading={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                        Submit Report
                    </Button>
                </div>
            </div>
        </form>
    );
}