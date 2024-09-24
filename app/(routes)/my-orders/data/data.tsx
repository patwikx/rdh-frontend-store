import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons"
  
  export const labels = [
    {
      value: "bug",
      label: "Contrusction Supplies",
    },
    {
      value: "feature",
      label: "Fishing Supplies",
    },
    {
      value: "documentation",
      label: "DIY",
    },
  ]
  
  export const statuses = [

    {
      value: "todo",
      label: "Fullfilled",
      icon: CircleIcon,
    },
    {
      value: "in progress",
      label: "Processing",
      icon: StopwatchIcon,
    },
    {
      value: "done",
      label: "Delivered",
      icon: CheckCircledIcon,
    },
    {
      value: "canceled",
      label: "Canceled",
      icon: CrossCircledIcon,
    },
  ]
  
  export const priorities = [
    {
      label: "234.00",
      value: "low",
      icon: ArrowDownIcon,
    },
    {
      label: "23,421.00",
      value: "medium",
      icon: ArrowRightIcon,
    },
    {
      label: "86,734.00",
      value: "high",
      icon: ArrowUpIcon,
    },
  ]