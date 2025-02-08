package com.service.main.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.messaging.FirebaseMessaging;
import com.service.main.repository.AdminRepository;
import com.service.main.repository.RoleRepository;
import com.service.main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class ApplicationConfiguration {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        GoogleCredentials googleCredentials = GoogleCredentials
                .fromStream(new ClassPathResource("firebase.json").getInputStream());
        FirebaseOptions firebaseOptions = FirebaseOptions
                .builder()
                .setCredentials(googleCredentials)
                .setDatabaseUrl("https://eproject4-3c13d-default-rtdb.asia-southeast1.firebasedatabase.app")
                .build();
        return FirebaseApp.initializeApp(firebaseOptions, "my-app");
    }

    @Bean
    public FirebaseMessaging firebaseMessaging(FirebaseApp firebaseApp) {
        return FirebaseMessaging.getInstance(firebaseApp);
    }

    @Bean
    public DatabaseReference firebaseDatabaseReference(FirebaseApp firebaseApp) {
        return FirebaseDatabase.getInstance(firebaseApp).getReference();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            @Transactional
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                String[] parts = username.split("_");
                if(parts[1].equals("admin")) {
                    var admin = adminRepository.findByEmail(parts[0]);

                    if(admin != null) {
                        List<String> roleList = new ArrayList<>();
                        for(var roleObj: admin.getAdminRoles()){
                            var role = roleObj.getRole().getRoleName();
                            roleList.add("ROLE_" + role);
                        }
                        return new org.springframework.security.core.userdetails.User(
                                admin.getEmail(),
                                admin.getPassword(),
                                mapRolesToAuthorities(roleList));
                    }else {
                        throw new UsernameNotFoundException("Invalid username or password.");
                    }
                }

                if (parts[1].equals("user")) {
                    var user = userRepository.findUserByEmail(parts[0]);
                    if(user != null){
                        List<String> roleList = new ArrayList<>();
                        roleList.add("ROLE_USER");
                        return new org.springframework.security.core.userdetails.User(
                                user.getEmail(),
                                user.getPassword(),
                                mapRolesToAuthorities(roleList));
                    }else {
                        throw new UsernameNotFoundException("Invalid username or password.");
                    }
                }

                return null;
            }

            private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<String> roleList) {
                return roleList.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
            }
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}
