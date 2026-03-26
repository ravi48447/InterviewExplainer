# Inversion of Control (IoC) vs Dependency Injection (DI)

## Inversion of Control (IoC)
IoC is a **design principle**. It means that the control of object creation, configuration, and lifecycle is transferred from the application code to a container or framework.

Instead of your code saying:
```java
Service service = new Service();
```
Your code says: "I need a Service, please give it to me."

## Dependency Injection (DI)
DI is a **design pattern** used to implement IoC. It is the actual act of injecting the dependencies.

### Types of DI
1.  **Constructor Injection** (Recommended)
    ```java
    @Service
    public class MyService {
        private final Repository repo;
        
        public MyService(Repository repo) {
            this.repo = repo;
        }
    }
    ```
2.  **Setter Injection**
3.  **Field Injection** (`@Autowired` on field - Not recommended)

## Summary
*   **IoC** is the *concept* (The "What").
*   **DI** is the *implementation* (The "How").
