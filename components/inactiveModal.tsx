"use client"
import { useModal } from "@/hooks/use-modal.store"
import { useRouter } from "next/navigation"

export const InactiveModal = () => {
    const { isOpen, onClose, type } = useModal()
    const router=useRouter()
    const isModalOpen = isOpen && type === "inactive";

    const cancelClick=()=>{
        localStorage.clear()
        router.refresh()
        window.location.reload()
        onClose()
    }
    const confirmClick=()=>{
        onClose()
    }

    return (
        <>
            {isModalOpen &&
                <>
                    <div className="absolute left-0 right-0 top-0 bottom-0 bg-black/50 z-50 flex justify-center items-center">
                        <div className="bg-white  pt-10 pb-6 rounded-md flex flex-col">
                            <div className="px-32 text-2xl text-center font-bold text-black">İşlem Durdu</div>
                            <div className="px-32 text-zinc-500 pt-2">İşleme devam etmek istiyor musunuz?</div>
                            <div className="px-8 w-full flex flex-row items-center pt-3 gap-2">
                                <button className="rounded-xl transition w-1/2 text-black hover:bg-gray-100 px-6 py-4" onClick={cancelClick} >Hayır</button>
                                <button className="rounded-xl transition w-1/2 text-black bg-gray-100 hover:bg-gray-300 px-6 py-4" onClick={confirmClick} >Evet</button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )

}