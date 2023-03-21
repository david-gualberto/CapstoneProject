package it.davidgualberto.apt.models;
import java.util.Collection;
import javax.validation.constraints.Email;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import it.davidgualberto.apt.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccessDetails implements UserDetails {
	
	private static final long serialVersionUID = 1L;
	private int id;
	private String username;
	
	@Email
	private String email;
	private String password;
	private String name;
	private String surname;
	private String city;

	public static AccessDetails build(User u) {
		return new AccessDetails(u.getId(), u.getUsername(), u.getEmail(), u.getPassword(), u.getName(), u.getSurname(), u.getCity());
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

}
