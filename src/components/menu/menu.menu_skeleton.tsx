import { Skeleton } from "../ui/skeleton"

const MenuSkeleton = () => {
    const skeletonSpawn = () => {
        const skeletonSpan = []
        for (let i = 0; i < 6; i++) {
            skeletonSpan.push(
                <div key={`skeleton-${i}`}
                    className="bg-gray-300 rounded-lg shadow-md overflow-hidden w-150
                                 hover:shadow-lg cursor-not-allowed flex flex-col">
                    <div className="mt-0">
                        <div className="relative md:h-48 sm:h-36">
                            <Skeleton className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                    </div>
                    <div
                        className="p-2 place-items-center flex">
                        <Skeleton className="h-4 px-2" />
                        <div className="flex items-center p-3 place-items-center h-4">
                            <Skeleton className="ml-2 h-4 w-10" />
                        </div>
                    </div>
                </div>
            )
        }

        return skeletonSpan;
    }
    return (
        <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletonSpawn()}
            </div>
        </>
    )
}

export default MenuSkeleton