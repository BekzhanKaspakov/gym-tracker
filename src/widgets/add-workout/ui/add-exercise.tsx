import { Button, Input, Label } from "@/shared/ui-kit";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui-kit/popover";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/ui-kit/select";
import { CATEGORIES } from "@/shared/constants/common";
import { useAddExercise } from "@/shared/api/exercises";

export function AddExercise() {
  const createExercise = useAddExercise()
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [exerciseName, setExerciseName] = useState<string>("")
  const [exerciseCategory, setExerciseCategory] = useState<typeof CATEGORIES[number]>(CATEGORIES[0])

  const handleCreateSubmit = () => {
    createExercise.mutate({
      label: exerciseName,
      exerciseCategory: exerciseCategory
    }, {
      onSuccess: () => {
        setIsOpen(false)
      }
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Add Exercise</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-secondary">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Exercise Name</Label>
              <Input
                id="width"
                className="bg-background col-start-2 col-span-2"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Category</Label>
              <Select value={exerciseCategory} onValueChange={(val) => setExerciseCategory(val as typeof CATEGORIES[number])}>
                <SelectTrigger className="bg-background col-start-2 col-span-2 w-auto">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cateogries</SelectLabel>
                    {CATEGORIES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCreateSubmit}>Save</Button>
        </div>
      </PopoverContent>
    </Popover >
  )
}
