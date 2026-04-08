# FINAL Pseudocode (English, Structured)

## 1. Add Sample to Queue (Menu 1)
```
procedure AddSampleToQueue
    input sender_name
    validate sender_name (min 3 letters, letters/space/dash)
    if invalid then
        print "Invalid sender name"
        return
    end if
    select test_type (1–10)
    if invalid then
        print "Invalid test type"
        return
    end if
    input test_date (DD/MM/YYYY)
    validate test_date (legal day, 2000–2100)
    if invalid then
        print "Invalid date"
        return
    end if
    autogen sample_code = next SPL-XXXX
    prompt "Save sample? (Y/N)"
    if yes then
        insert sample into queue (sorted by soonest test_date, FIFO for same date)
        print "Sample added"
    else
        print "Sample not saved"
    end if
end procedure
```

## 2. Process Next Sample (Menu 2)
```
procedure ProcessNextSample
    if queue is empty then
        print "No sample to process"
        return
    end if
    dequeue node from queue (earliest test_date)
    push to finished stack
    print "Sample processed"
end procedure
```

## 3. Queue and History (Menu 3, 4, 5)
```
procedure PrintQueue
    for each sample in queue
        print sample details (by test_date priority)
end procedure

procedure PrintLastProcessed
    if finished stack empty then
        print "No processed sample"
    else
        print details of top of stack
end procedure

procedure PrintHistory
    for each sample in finished_stack (LIFO)
        print sample details
end procedure
```

## 4. Search Sample (Menu 6)
```
procedure SearchSample
    input sample_code (SPL-XXXX)
    if exists in queue then
        print details
    else if exists in finished stack then
        print details
    else
        print "Sample not found"
    end if
end procedure
```

## 5. Lab Statistics (Menu 7)
```
procedure PrintLabStats
    total = queue.size + finished_stack.size
    print total samples, queue size, finished stack size
    print completion percentage
    print last SPL code
end procedure
```

## 6. Filter by Test Type (Menu 8)
```
procedure FilterByTestType
    input test_type (1–10)
    found = false
    for each sample in queue
        if sample.test_type == test_type then
            print sample (queue)
            found = true
        end if
    end for
    for each sample in finished_stack
        if sample.test_type == test_type then
            print sample (finished)
            found = true
        end if
    end for
    if not found then
        print "No sample found for this test type"
    end if
end procedure
```

## 7. Exit (Menu 0)
```
procedure ExitProgram
    exit
end procedure
```