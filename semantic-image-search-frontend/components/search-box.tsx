"use client";

import {SearchIcon, X} from "lucide-react";
import {Input} from "@nextui-org/input";
import {useRef, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Button} from "@nextui-org/button";
import {useSharedTransition} from "@/hooks/use-shared-transition";
import {useDebouncedCallback} from "use-debounce";
import {FRONTEND_API_BASE_URL} from "@/constants";

export default function SearchBox({
                                      query,
                                      disabled,
                                  }: {
    query?: string | null;
    disabled?: boolean;
}) {

    const {startTransition} = useSharedTransition();
    const [isValid, setIsValid] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const pathname = usePathname();

    const inputRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();
    const q = searchParams.get("q")?.toString() ?? "";

    const router = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }

        router.push(`${pathname}?${params.toString()}`);
    }, 300);

    // const resetQuery = () => {
    //     router.push(pathname);
    //     if (inputRef.current) {
    //         inputRef.current.value = '';
    //         inputRef.current.focus();
    //     }
    // };

    const resetQuery = () => {
        startTransition && startTransition(() => {

            router.push(`${FRONTEND_API_BASE_URL}/search`);

            if (inputRef.current) {
                inputRef.current.value = "";
                inputRef.current?.focus();
            }

            // setSearchResults([]);
        });
    }

    return (
        <div className={"flex flex-col"}>
            <div className={"w-full mx-auto mb-4"}>
                <div className={"relative flex items-center space-x-2"}>
                    <div className={"relative w-full flex items-center"}>
                        <SearchIcon className={"absolute left-4 w-5 h-5 text-gray-500"}/>
                        <Input
                            disabled={disabled}
                            ref={inputRef}
                            defaultValue={query ?? ""}
                            minLength={1}

                            onChange={(e) => {
                                const newValue = e.target.value;
                                if (newValue.length > 0) {
                                    setIsValid(true);
                                    handleSearch(newValue);
                                } else if (newValue.length === 0) {
                                    handleSearch(newValue);
                                    setIsValid(false);
                                } else {
                                    setSearchResults([]);
                                    setIsValid(false);
                                }
                            }}

                            className={"text-base w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"}
                            placeholder={"Input Search Query"}
                        />
                        {q.length > 0 ? (
                            <Button
                                className="absolute right-2 text-gray-400 rounded-full h-8 w-8"
                                variant="ghost"
                                type="reset"
                                size="sm"
                                onClick={resetQuery}
                            >
                                <X height={20} width={20}/>
                            </Button>
                        ) : null}
                    </div>
                </div>
                {!isValid ? (
                    <div className="text-xs pt-2 text-destructive">
                        Query must be 1 character or longer
                    </div>
                ) : (
                    <div className="h-6"/>
                )}
            </div>
        </div>
    );
}