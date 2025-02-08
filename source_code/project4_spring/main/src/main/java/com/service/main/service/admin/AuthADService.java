package com.service.main.service.admin;

import com.service.main.dto.*;
import com.service.main.repository.AdminRepository;
import com.service.main.service.JwtService;
import com.service.main.service.MailService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthADService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MailService mailService;

    public CustomResult resetEmployeePasswoord(ResetPasswordDto resetPasswordDto) {
        try{

            var employee = adminRepository.findById(resetPasswordDto.getId());

            if(employee.isEmpty()){
                return new CustomResult(404, "employee not found", null);
            }

            employee.get().setPassword(passwordEncoder.encode(resetPasswordDto.getPassword()));

            adminRepository.save(employee.get());

            mailService.sendMail(null, employee.get().getEmail(), new String[]{employee.get().getEmail()}, "Your UrbanNest new password", getNewPasswordMailBody(resetPasswordDto.getPassword()));


            return new CustomResult(200, "success", null);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }

    public CustomResult resetEmployeeOwnPasswoord(String email, ResetPasswordDto resetPasswordDto) {
        try{

            var employee = adminRepository.findByEmail(email);

            if(employee == null){
                return new CustomResult(404, "employee not found", null);
            }

            if(!passwordEncoder.matches(resetPasswordDto.getPrevious(), employee.getPassword())){
                return new CustomResult(403, "Wrong current password check", null);
            }

            employee.setPassword(passwordEncoder.encode(resetPasswordDto.getPassword()));

            adminRepository.save(employee);

            mailService.sendMail(null, employee.getEmail(), new String[]{employee.getEmail()}, "Your UrbanNest new password", getNewPasswordMailBody(resetPasswordDto.getPassword()));


            return new CustomResult(200, "success", null);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }

    public CustomResult admin(String email){
        try{
            var admin = adminRepository.findByEmail(email);

            if(admin == null){
                return new CustomResult(404, "Not found", null);
            }

            var adminDto = new AdminDto();

            BeanUtils.copyProperties(admin, adminDto);

            var roleList = new ArrayList<RoleDto>();

            for(var roleObj : admin.getAdminRoles()){
                var roleDto = new RoleDto();
                roleDto.setId(roleObj.getRole().getId());
                roleDto.setRoleName(roleObj.getRole().getRoleName());
                roleList.add(roleDto);
            }

            adminDto.setRoles(roleList);

            var cityList = new ArrayList<ManagedCityDto>();

            for(var cityObj : admin.getAdminManageCities()){
                var cityDto = new ManagedCityDto();
                cityDto.setId(cityObj.getManagedCity().getId());
                cityDto.setCityName(cityObj.getManagedCity().getCityName());
                cityList.add(cityDto);
            }
            
            adminDto.setCities(cityList);

            return new CustomResult(200, "OK", adminDto);
        }catch (Exception e){
            return new CustomResult(400, "Bad request", null);
        }
    }


    public CustomResult login(LoginDto loginDto) {
        try{
            var admin = adminRepository.findByEmail(loginDto.getEmail());

            if(admin != null && passwordEncoder.matches(loginDto.getPassword(), admin.getPassword())){

                if(!admin.isStatus()){
                    return new CustomResult(403, "Account is not active", null);
                }

                var roleList = new ArrayList<String>();

                for(var roleObj : admin.getAdminRoles()){
                    roleList.add(roleObj.getRole().getRoleName());
                }
                Map<String, Object> claims = new HashMap<>();
                claims.put("roles", roleList);
                var token = jwtService.generateToken(claims, admin.getEmail(), "admin");
                return new CustomResult(200, "Success", token);
            }

            return new CustomResult(404, "Not found", null);

        }catch (Exception ex){
            return new CustomResult(400, "Bad request", null);
        }
    }

    public String getNewPasswordMailBody(String password){

        return """
                <div style="background-color:white;border-radius:8px;box-shadow:0 4px 8px rgba(0, 0, 0, 0.1);max-width:500px;padding:40px;text-align:center;width:100%;">
                            <h1 style="color:#2d3e50;font-size:24px;margin-bottom:20px;">New Password Set Successfully!</h1>
                            <p style="color:#4CAF50;font-size:16px;margin-bottom:20px;">Your new password has been successfully updated. You can now use your new password to access your Urban Nest account.</p>
                            <p style="color:#4CAF50;font-size:16px;margin-bottom:20px;">Your new password is """ + " " + password + """ 
                            .</p>
                            <div style="color:#555;font-size:14px;margin-bottom:20px;">
                                <p>If you did not request this change, please contact support immediately.</p>
                                <p>Thank you for being a part of Urban Nest!</p>
                            </div>
                            <p><a style="background-color:#4a90e2;border-radius:4px;color:white;display:inline-block;font-size:16px;padding:12px 20px;text-decoration:none;transition:background-color 0.3s;" target="_blank" rel="noopener noreferrer" href="http://localhost:5173/UrbanNest/admin/">Go to Login</a></p>
                        </div>
                """;
    }
}
