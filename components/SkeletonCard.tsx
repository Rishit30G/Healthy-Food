import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SkeletonCard = () => {
  return (
    <>
      {[1,2,3,4].map((_, i) => (
        <Card key={i} className="bg-green-100/30 shadow-lg rounded-t-xl w-full">
          <CardContent className="space-y-5">
            <div className="w-full h-80 bg-green-800/20 rounded-tr-lg rounded-tl-lg animate-pulse" />
            <div className="flex justify-between flex-col w-full gap-2 px-3">
              <div className="w-3/4 h-4 bg-green-800/20 rounded animate-pulse" />
              <div className="w-1/2 h-3 bg-green-800/20 rounded animate-pulse" />
            </div>
          </CardContent>
          <CardFooter className="justify-end items-center px-4 mb-3">
            <div className="w-6 h-6 bg-green-800/20 rounded-full animate-pulse" />
          </CardFooter>
        </Card>
      ))}
  </>
  )
}

export default SkeletonCard