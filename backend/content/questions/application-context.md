# What is the ApplicationContext?

The `ApplicationContext` is the central interface to the Spring IoC container. It is responsible for instantiating, configuring, and assembling the beans (objects) in your application.

## Key Features

1.  **Bean Factory**: It is a superset of the simple `BeanFactory`. It maintains the bean definitions and dependencies.
2.  **Resource Loading**: It provides a generic way to load file resources (images, properties, etc.).
3.  **Event Publishing**: It supports publishing events to registered listeners (`ApplicationEventPublisher`).
4.  **Internationalization (i18n)**: It supports messages and internationalization.

## Common Implementations

*   `AnnotationConfigApplicationContext`: Used for Java-based configuration (Spring Boot uses this heavily).
*   `ClassPathXmlApplicationContext`: Loads context from an XML file on the classpath (Legacy).
*   `FileSystemXmlApplicationContext`: Loads context from an XML file from the file system.

## Example

```java
// initializing context
ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

// retrieving a bean
MyService service = context.getBean(MyService.class);
service.doSomething();
```

In Spring Boot, the `SpringApplication.run()` method returns the `ApplicationContext`, so you rarely need to create it manually.
