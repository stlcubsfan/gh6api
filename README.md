# gh6api

## API Examples

Query by range and location:
```
http://localhost:3001/agencies?range=20&xpos=38.7591332&ypos=-90.297514

With Beds in range for 10 people:
http://localhost:3001/agencies?range=20&xpos=38.7591332&ypos=-90.297514&beds_needed=10
```

Just query for any agency with 10 beds:
```
http://localhost:3001/agencies?beds_needed=10
```

Query by other parameter:
```
http://localhost:3001/agencies?name=Almost%20Home
```

Reservations:
```
http://localhost:3001/agencies/1/reservations
```

Programs:
```
http://localhost:3001/agencies/1/programs
```

Clients for Programs:
```
http://localhost:3001/agencies/1/programs/2/clients
```
