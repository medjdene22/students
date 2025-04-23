import { useEffect, useState } from "react"
import { Calendar } from "./ui/calendar"
import { useParams, usePathname, useRouter } from "next/navigation"
import { format, parse, startOfMonth } from "date-fns"
import { useTeacherAssignmentId } from "@/features/teacher-user/hooks/use-teacher-assignment-id"
import { useTeacherSubjectId } from "@/features/teacher-user/hooks/use-teacher-subject-id"
import { useGetTeacherAssignment } from "@/features/teacher-user/api/use-get-teacher-assignment"


export function CalendarNav() {
    const router = useRouter()
    const {day} = useParams()
    const [date, setDate] = useState<Date | undefined>()
    const [displayMonth, setDisplayMonth] = useState<Date | undefined>()
    const teacherSubjectId = Number(useTeacherSubjectId())
    const teacherAssignmentId = Number(useTeacherAssignmentId())
    const { data: assignment, isLoading } = useGetTeacherAssignment({id: teacherAssignmentId})
    
    useEffect(() => {        
        
        if (day) {
            const parsedDate = parse(day as string, 'dd-MM-yyyy', new Date())
            if (!isNaN(parsedDate.getTime())) {
                setDate(parsedDate)
                setDisplayMonth(startOfMonth(parsedDate))
                
            }else{
                const currentDate = new Date()
                setDate(currentDate)
                setDisplayMonth(startOfMonth(currentDate))
            }
        }else{
            const currentDate = new Date()
            setDate(currentDate)
            setDisplayMonth(startOfMonth(currentDate))
        }  
        
    }, [day])

    const onchange = (selectedDate: Date | undefined) => {
        if (!selectedDate) return
        const formattedDate = format(selectedDate, 'dd-MM-yyyy')
        router.push(`/dashboard/subject/${teacherSubjectId}/group/${teacherAssignmentId}/${formattedDate}`)
    }
    const onDayClick = (selectedDate: Date | undefined) =>{
        if(selectedDate?.getDate() == date?.getDate()){
            onchange(selectedDate)
        }    
    }

    // const specialDates = [
    //     new Date(2025, 10, 15),  // November 15, 2023
    //     new Date(2025, 10, 20),  // November 20, 2023
    //     new Date(2025, 10, 25),  // November 25, 2023
    // ];
    
    // // Birthdays to highlight differently
    // const birthdays = [
    //     new Date(2025, 10, 5),   // November 5, 2023
    //     new Date(2025, 10, 10),  // November 10, 2023
    // ];

    // const modifiers = {
    //     special: specialDates,
    //     birthday: birthdays
    // };
    // const modifierClassNames = {
    //     special: 'text-red-700 border border-red-700 font-bold',
    //     birthday: 'text-green-700 font-bold'
    // };

    if (assignment?.assignment=="exam") {
        return (
            <div className="">
                
            </div>
        )
        
    }
    return (
        <Calendar

            // modifiers={modifiers}
            // modifiersClassNames={modifierClassNames}

                    mode="single"
                    selected={date}
                    onDayClick={onDayClick}
                    onSelect={onchange}
                    month={displayMonth}
                    onMonthChange={setDisplayMonth}
                    defaultMonth={displayMonth}
                    className="[&_[role=gridcell]]:w-[33px] group-data-[collapsible=icon]:hidden border-y-2 font-bold"
        />
    )
}