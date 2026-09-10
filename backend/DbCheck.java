import java.sql.*;

public class DbCheck {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/interviewexplainer";
        String user = "interviewexplainer";
        String password = "changeme";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connected to the PostgreSQL server successfully.");
            
            try (Statement stmt = conn.createStatement()) {
                ResultSet rs = stmt.executeQuery("SELECT count(*) FROM domains");
                if (rs.next()) {
                    System.out.println("DOMAIN_COUNT=" + rs.getInt(1));
                }

                rs = stmt.executeQuery("SELECT count(*) FROM questions");
                if (rs.next()) {
                    System.out.println("QUESTION_COUNT=" + rs.getInt(1));
                }
                
                rs = stmt.executeQuery("SELECT name, slug FROM domains LIMIT 5");
                System.out.println("SAMPLE_DOMAINS:");
                while (rs.next()) {
                    System.out.println("  - " + rs.getString("name") + " (" + rs.getString("slug") + ")");
                }

                System.out.println("\nChecking answers for 'react-basics' questions...");
                ResultSet rsAns = stmt.executeQuery(
                    "SELECT q.slug, count(a.id) FROM questions q " +
                    "LEFT JOIN answer_sections a ON q.id = a.question_id " +
                    "JOIN question_stack_index qsm ON q.id = qsm.question_id " +
                    "JOIN tech_stacks ts ON qsm.stack_id = ts.id " +
                    "WHERE ts.slug = 'react-basics' " +
                    "GROUP BY q.slug LIMIT 5"
                );
                while (rsAns.next()) {
                    System.out.println(" - Q: " + rsAns.getString(1) + ", Answers: " + rsAns.getInt(2));
                }
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
}
