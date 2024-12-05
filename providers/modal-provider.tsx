"use client"

import { CannotSelectMore } from "@/components/cannotSelectMore"
import { InactiveModal } from "@/components/inactiveModal"
import { SelectedSeatFull } from "@/components/selectedSeatFull"
import { SuccessModal } from "@/components/successModal"
import { useEffect, useState } from "react"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted){
        return null;
    }

    return(
        <>
            <InactiveModal />
            <SelectedSeatFull />
            <CannotSelectMore/>
            <SuccessModal/>
        </>
    )
}