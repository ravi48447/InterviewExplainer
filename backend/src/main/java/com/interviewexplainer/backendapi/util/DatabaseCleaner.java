package com.interviewexplainer.backendapi.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DatabaseCleaner {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/interviewexplainer";
        String user = "interviewexplainer";
        String password = "changeme";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Initiating Ultimate Database Clean...");
            
            // Drop everything with CASCADE
            String sql = "DO $$ DECLARE" +
                         " r RECORD;" +
                         " BEGIN" +
                         " FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP" +
                         " EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';" +
                         " END LOOP;" +
                         " FOR r IN (SELECT typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typtype = 'e') LOOP" +
                         " EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';" +
                         " END LOOP;" +
                         " END $$;";
            
            stmt.execute(sql);
            System.out.println("Clean SUCCESSFUL. All tables and custom types purged.");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
